import React, { Component } from "react";
import ProductListItem from "../components/ProductListItem";
import {
  ActivityIndicator,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert
} from "react-native";

import {connect} from "react-redux"
import {bindActionCreators} from "redux";
import * as productActionCreators from "../actionCreators/product";
let URI = "http://192.168.1.101:4000";
class ProductListWithFlatList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.getProducts(this.props.page,this.props.limit);
  }

  onWishTapped = id => {
    //Alert.alert(`Product tapped :${id}`);
    // let updateIndex = this.state.products.findIndex(p => p.id === id);
    // this.state.products[updateIndex].wish = !this.state.products[updateIndex]
    //   .wish;
    // this.setState({ products: [...this.state.products] }, function() {
    //   console.log(this.state);
    // });
  };

  _getProducts = (page=1,limit=8) => {
    this.props.actions.getProducts(page,limit);
  };

  /*  flat list supporting methods */

  _getMore = () => {
    console.log('getmore')
    this._getProducts(++this.props.page,this.props.limit);
  };

  _renderItem = ({ index, item }) => {
    return (
      <ProductListItem
        {...this.props}
        id={item.id}
        title={`${item.id} - ${item.title}`}
        image={item.image ? `${URI}/images/${item.image}`:null}
        rating={item.rating}
        price={item.price}
        wish={item.wish || false}
        onWishTapped={this.onWishTapped}
      />
    );
  };

  _keyExtractor = (item, index) => {
    return `${index}`;
  };

  _onRefresh = () => {
    //this.setState({ isRefreshing: true });
    this._getProducts();
  };

  _renderRefreshControl() {
    return (
      <RefreshControl
        onRefresh={this._onRefresh}
        refreshing={this.props.isRefreshing}
        tintColor={"#00ff80"}
        title={"Refreshing..."}
        titleColor={"#00ff80"}
      />
    );
  }

  /*  flat list supporting methods - END */

  render() {
    return this.props.isLoading ? (
      <ActivityIndicator size="large" color="#00ff80" />
    ) : (
      <FlatList
        data={this.props.products}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this._getMore}
        refreshControl={this._renderRefreshControl()}
      />
    );
  }


}

function mapStateToProps(state){
 
  return{
    products:state.productState.products,
    isLoading:state.productState.isLoading,
    isRefreshing: state.productState.isRefreshing,
    page:state.productState.page,
    limit:state.productState.limit,
  }
}

function mapDispatchToProps(dispatch){ 
  return{
    actions:bindActionCreators(productActionCreators,dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductListWithFlatList);

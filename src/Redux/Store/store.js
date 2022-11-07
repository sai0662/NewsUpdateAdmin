import {createStore, combineReducers, applyMiddleware} from 'redux';
import newspostsReducer from '../Reducer/newspostsReducer';
import newscategoriesReducer from '../Reducer/newscategoriesReducer';
import thunk from 'redux-thunk';

const reducers = combineReducers({
  posts: newspostsReducer,
  categories: newscategoriesReducer,
});
const store = createStore(reducers, applyMiddleware(thunk));
export default store;

// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import featuredNewsReducer from "../slicers/FeatheredNewsSlice.js";
import newsReducer from "../slicers/NewsSlice.js";
import eventsReducer from "../slicers/EventSlice.js";
import subscribedNewsReducer from "../slicers/SubscribedNewsSlice.jsx";
import subscriptionReducer from "../slicers/SubscriptionSlice.jsx";
import regionReducer from "../slicers/RegionSlice.jsx";
import AllEventsReducer from "../slicers/AllEventsSlice.js";
import specificNewsReducer from "../slicers/FetchSpecificNews.jsx";
import trendingNewsReducer from "../slicers/FetchTrendingNews";
import descriptionReducer from "../slicers/DescriptionSlice.jsx";
import editorPicNewsReducer from "../slicers/EditorsPicNewsSlice.jsx";
import newsImageReducer from "../slicers/NewsImageSlice.jsx";

export const store = configureStore({
  reducer: {
    featuredNews: featuredNewsReducer,
    news: newsReducer,
    events: eventsReducer,
    subscribedNews: subscribedNewsReducer,
    subscription: subscriptionReducer,
    region: regionReducer,
    AllEvents: AllEventsReducer,
    specificNews: specificNewsReducer,
    trendingNews: trendingNewsReducer,
    description: descriptionReducer,
    editorPicNews: editorPicNewsReducer,
    newsImage: newsImageReducer,
  },
});

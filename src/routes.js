import React, { useEffect } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Axios from "axios"
import { useImmerReducer } from "use-immer"

import "./Main/styles.css"
//No Route components
import Header from "./Main/components/Header"
import Footer from "./Main/components/Footer"

//Routes components
import HomeGuest from "./Main/components/HomeGuest"
import About from "./Main/components/About"
import Terms from "./Main/components/Terms"
import Home from "./Main/components/Home"
import CreatePost from "./Main/components/CreatePost"
import SinglePost from "./Main/components/SinglePost"
import FlashMessages from "./Main/components/FlashMessages"
import Profile from "./Main/components/Profile" //ERRO AQUI DEVE SER PROFILE
//
import DispatchContext from "./Main/DispatchContext"
import StateContext from "./Main/StateContext"

//Default url
Axios.defaults.baseURL = "http://localhost:8080"

export default function Routes() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      avatar: localStorage.getItem("avatar")
    }
  }

  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState) //Reducer needs a function and a state as arguments

  useEffect(() => {
    if (state.loggedIn) {
      //Save data in browser's local storage to remember user is logged in.
      localStorage.setItem("token", state.user.token)
      localStorage.setItem("username", state.user.username)
      localStorage.setItem("avatar", state.user.avatar)
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      localStorage.removeItem("avatar")
    }
  }, [state.loggedIn]) //Any time loggedIn changes this useEffet will run

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/post/:id">
              <SinglePost />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

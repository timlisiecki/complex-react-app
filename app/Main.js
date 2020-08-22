import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Axios from 'axios';
Axios.defaults.baseURL = 'http://localhost:8080';

// Context
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';

// Components
import FlashMessages from './components/FlashMessages';
import Header from './components/Header';
import HomeGuest from './components/HomeGuest';
import Home from './components/Home';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import ViewSinglePost from './components/ViewSinglePost';
import EditPost from './components/EditPost';
import About from './components/About';
import Terms from './components/Terms';
import NotFound from './components/NotFound';
import Search from './components/Search';
import Chat from './components/Chat';
import Footer from './components/Footer';

function Main() {
	const initialState = {
		loggedIn: Boolean(localStorage.getItem('complexappToken')),
		flashMessages: [],
		user: {
			token: localStorage.getItem('complexappToken'),
			username: localStorage.getItem('complexappUsername'),
			avatar: localStorage.getItem('complexappAvatar'),
		},
		isSearchOpen: false,
		isChatOpen: false,
		unreadChatCount: 0,
	};
	function ourReducer(draft, action) {
		switch (action.type) {
			case 'login':
				draft.loggedIn = true;
				draft.user = action.data;
				break;
			case 'logout':
				draft.loggedIn = false;
				break;
			case 'flashMessage':
				draft.flashMessages.push(action.value);
				break;
			case 'openSearch':
				draft.isSearchOpen = true;
				break;
			case 'closeSearch':
				draft.isSearchOpen = false;
				break;
			case 'toggleChat':
				draft.isChatOpen = !draft.isChatOpen;
				break;
			case 'closeChat':
				draft.isChatOpen = false;
				break;
			case 'incrementUnreadChatCount':
				draft.unreadChatCount++;
				break;
			case 'clearUnreadChatCount':
				draft.unreadChatCount = 0;
				break;
		}
	}
	const [state, dispatch] = useImmerReducer(ourReducer, initialState);

	useEffect(() => {
		if (state.loggedIn) {
			localStorage.setItem('complexappToken', state.user.token);
			localStorage.setItem('complexappUsername', state.user.username);
			localStorage.setItem('complexappAvatar', state.user.avatar);
		} else {
			localStorage.removeItem('complexappToken');
			localStorage.removeItem('complexappUsername');
			localStorage.removeItem('complexappAvatar');
		}
	}, [state.loggedIn]);

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={dispatch}>
				<BrowserRouter>
					<FlashMessages messages={state.flashMessages} />
					<Header />
					<Switch>
						<Route path='/' exact>
							{state.loggedIn ? <Home /> : <HomeGuest />}
						</Route>
						<Route path='/profile/:username'>
							<Profile />
						</Route>
						<Route path='/post/:id' exact>
							<ViewSinglePost />
						</Route>
						<Route path='/post/:id/edit' exact>
							<EditPost />
						</Route>
						<Route path='/create-post'>
							<CreatePost />
						</Route>
						<Route path='/about-us'>
							<About />
						</Route>
						<Route path='/terms'>
							<Terms />
						</Route>
						<Route>
							<NotFound />
						</Route>
					</Switch>
					<CSSTransition timeout={330} in={state.isSearchOpen} classNames='search-overlay' unmountOnExit>
						<Search />
					</CSSTransition>
					<Chat />
					<Footer />
				</BrowserRouter>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
}

ReactDOM.render(<Main />, document.querySelector('#app'));

if (module.hot) {
	module.hot.accept();
}

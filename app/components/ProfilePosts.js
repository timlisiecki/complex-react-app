import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import Post from './Post';
import LoadingDotsIcon from './LoadingDotsIcon';

function ProfilePosts(props) {
	const { username } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
				setPosts(response.data);
				setIsLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
		fetchPosts();
		return () => {
			ourRequest.cancel();
		};
	}, [username]);

	if (isLoading) return <LoadingDotsIcon />;

	return (
		<div className='list-group'>
			{posts.map(post => {
				return <Post post={post} key={post._id} noAuthor={true} />;
			})}
		</div>
	);
}

export default ProfilePosts;

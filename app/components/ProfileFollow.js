import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import LoadingDotsIcon from './LoadingDotsIcon';

function ProfileFollow(props) {
	const { username } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const ourRequest = Axios.CancelToken.source();

		async function fetchPosts() {
			try {
				const response = await Axios.get(`/profile/${username}/${props.action}`, { cancelToken: ourRequest.token });
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
	}, [username, props.action]);

	if (isLoading) return <LoadingDotsIcon />;

	return (
		<div className='list-group'>
			{posts.map((follower, index) => {
				return (
					<Link key={index} to={`/profile/${follower.username}`} className='list-group-item list-group-item-action'>
						<img className='avatar-tiny' src={follower.avatar} /> {follower.username}
					</Link>
				);
			})}
		</div>
	);
}

export default ProfileFollow;

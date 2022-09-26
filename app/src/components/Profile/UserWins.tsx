import { useState } from 'react';
import { fetchText } from './FetchValue';

/*
** Must be passed the following props:
** username: The 42 username of the profile which we fetch
** className: The css module class for styling purposes
*/
export const UserWins = (props: any) => {
    const [userWins, setUserWins] = useState('');
    fetchText('users/' + props.username + '/wins', setUserWins);
    return (
      <h3 className={props.className}>W: {userWins}</h3>
    );
  }
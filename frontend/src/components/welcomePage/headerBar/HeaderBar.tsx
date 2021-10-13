import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import './HeaderBar.scss';
import { firebaseApp } from '../../firebase/firebase';

const HeaderBar: React.FunctionComponent = (): JSX.Element => {
  const signOut = async (e) => {
    try {
      await firebaseApp.auth().signOut();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="header-bar-div">
      <div onClick={signOut} className="top-border">
        <LogoutOutlined className="logout-icon" />
      </div>
    </div>
  );
};

export default HeaderBar;

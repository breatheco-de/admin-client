import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { MenuItem } from '../../utils/bc-components/index';

class MainMenu extends React.Component{
    
    render(){
        return(
            <ul className="nav flex-column">
                <MenuItem icon="fas fa-users" label="Dashboard" slug="dashboard" to="/dashboard" />
                <MenuItem icon="fas fa-users" label="Users" slug="user" to="/manage/user/" />
            </ul>
        )
    }
}
MainMenu.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  onClick: PropTypes.func,
  mobile: PropTypes.bool
}
MainMenu.defaultProps = {
  mobile: false
};
export default withRouter(MainMenu);
import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { MenuItem, Session, logout } from '../../utils/bc-components/src/index';

class MainMenu extends React.Component{
    
    constructor(){
        super();
        this.state = {
            session: Session.getSession()
        };
    }
    
    componentWillMount(){
        this.setState({
            session: Session.getSession()
        });
    }
    
    render(){
        if(!this.state.session.user) return (
            <ul className="nav flex-column">
                <MenuItem icon="fas fa-tachometer-alt" label="Log In" slug="login" to="/login" />
            </ul>
        );
        
        const role = this.state.session.user.type;
        return(
            <ul className="nav flex-column">
                <MenuItem icon="fas fa-tachometer-alt" label="Dashboard" slug="dashboard" to="/dashboard" />
                { (role == 'admin' || role == 'admissions') ? 
                    <MenuItem icon="fas fa-users" label="Students" slug="student" to="/manage/student/" />:''
                }
                { (role == 'admin' || role == 'admissions') ? 
                    <MenuItem icon="fas fa-users" label="Cohorts" slug="student" to="/manage/cohort/" />:''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-users" label="Profiles" slug="profile" to="/manage/profile/" /> :''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-users" label="Events" slug="event" to="/manage/event/" />:''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-users" label="Users" slug="user" to="/manage/user/" /> :''
                }
                <p>-</p>
                <MenuItem icon="fas fa-sign-out-alt" label="Close Session" slug="close_session"
                    onClick={() => logout()}
                />
            </ul>
        );
    }
}
MainMenu.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  onClick: PropTypes.func,
  mobile: PropTypes.bool
};
MainMenu.defaultProps = {
  mobile: false
};
export default withRouter(MainMenu);
import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { MenuItem, logout } from '../../utils/react-components/src/index';
import { Session } from 'bc-react-session';

class MainMenu extends React.Component{
    
    constructor(){
        super();
        this.state = {
            session: Session.store.getSession()
        };
    }
    
    componentDidMount(){
        this.setState({
            session: Session.store.getSession()
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
                <p className="m-0 mt-3">Manage:</p>
                { (role == 'admin' || role == 'admissions' || role == 'career-support') ? 
                    <MenuItem icon="fas fa-user-graduate" label="Students" slug="student" to="/manage/student/" />:''
                }
                { (role == 'admin' || role == 'admissions' || role == 'career-support') ? 
                    <MenuItem icon="fas fa-graduation-cap" label="Cohorts" slug="student" to="/manage/cohort/" />:''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-book-reader" label="Courses" slug="profile" to="/manage/profile/" /> :''
                }
                { (role == 'admin' || role == 'admissions') ? 
                    <MenuItem icon="fas fa-calendar-plus" label="Events" slug="event" to="/manage/event/?date_status=upcoming" />:''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-users" label="Users" slug="user" to="/manage/user/" /> :''
                }
                <p className="m-0 mt-3">Apps:</p>
                { (role == 'admin') ?
                    <MenuItem icon="fas fa-calendar-check" label="Event Checkin" slug="replit" to="/manage/i/checkin/" /> :''
                }
                { (role == 'admin') ?
                    <MenuItem icon="fas fa-dumbbell" label="Replits" slug="replit" to="/manage/i/replit/" /> :''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-question-circle" label="Quizzes" slug="quiz" to="/manage/i/quiz/" /> :''
                }
                { (role == 'admin') ? 
                    <MenuItem icon="fas fa-book" label="Syllabus" slug="syllabus" to="/manage/i/syllabus/" /> :''
                }
                <p>-</p>
                <MenuItem icon="fas fa-sign-out-alt" label="Logout" slug="close_session"
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
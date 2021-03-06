import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { MenuItem, logout } from '../../utils/react-components/src/index';
import { Session } from 'bc-react-session';

class MainMenu extends React.Component{

    constructor(){
        super();
        this.state = {
            session: Session.get()
        };
    }

    componentDidMount(){
        this.setState({
            session: Session.get()
        });
    }

    render(){
        if(!this.state.session.isValid) return (
            <ul className="nav flex-column">
                <MenuItem icon="fas fa-tachometer-alt" label="Log In" slug="login" to="/login" />
            </ul>
        );


        const role = this.state.session.payload.type;
        return(
            <ul className="nav flex-column">
                <MenuItem icon="fas fa-tachometer-alt" label="Dashboard" slug="dashboard" to="/dashboard" />
                <p className="m-0 mt-3">Manage:</p>
                { (['admin','admission','career-support','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-user-graduate" label="Students" slug="student" to="/manage/student/" />
                }
                { (['admin','admission','career-support','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-graduation-cap" label="Cohorts" slug="student" to="/manage/cohort/" />
                }
                { (['admin'].includes(role)) &&
                    <MenuItem icon="fas fa-book-reader" label="Courses" slug="profile" to="/manage/profile/" />
                }
                { (['admin','admission','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-calendar-plus" label="Events" slug="event" to="/manage/event/?date_status=upcoming" />
                }
                { (['admin','location-admin'].includes(role)) && <span>
                    <MenuItem icon="fas fa-users" label="Users" slug="user" to="/manage/user/" />
                    <MenuItem icon="fas fa-map-marked-alt" label="Locations" slug="location" to="/manage/location/" />
                    </span>
                }
                <p className="m-0 mt-3">Apps:</p>
                { (['admin','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-calendar-check" label="Event Checkin" slug="replit" to="/manage/i/checkin/" />
                }
                { (['admin','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-dumbbell" label="Replits" slug="replit" to="/manage/i/replit/" />
                }
                { (['admin','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-question-circle" label="Quizzes" slug="quiz" to="/manage/i/quiz/" />
                }
                { (['admin','location-admin'].includes(role)) &&
                    <MenuItem icon="fas fa-tasks" label="Attendancy" slug="attendancy" to="/manage/i/attendancy/" />
                }
                { (['admin'].includes(role)) &&
                    <MenuItem icon="fas fa-book" label="Syllabus" slug="syllabus" to="/manage/i/syllabus/" />
                }
                { (['admin'].includes(role)) &&
                    <MenuItem icon="fas fa-file-code" label="New Project" slug="project" to="/manage/i/project/" />
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
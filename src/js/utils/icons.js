/* global FontAwesomeConfig */
import fontawesome from '@fortawesome/fontawesome';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faGraduationCap from '@fortawesome/fontawesome-free-solid/faGraduationCap';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
import faEllipsisV from '@fortawesome/fontawesome-free-solid/faEllipsisV';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import faTachometerAlt from '@fortawesome/fontawesome-free-solid/faTachometerAlt';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
fontawesome.config = {
  autoReplaceSvg: 'nest'
};
fontawesome.library.add(
    faCheck, faGraduationCap, faPlay, faSpinner, faSearch, faGithub,
    faCog, faUsers, faEllipsisV, faSignOutAlt, faTachometerAlt, 
    faPlusCircle, faTrashAlt
);
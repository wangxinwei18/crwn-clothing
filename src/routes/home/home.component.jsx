import { Outlet } from 'react-router-dom';

import Directory from '../../components/directory/directory.component';

const Home = () => {
  console.log('Home component rendering');
  return (
    <div>
      <Directory />
      <Outlet />
    </div>
  );
};

export default Home;

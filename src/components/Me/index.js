import './index.scss';
import InteractiveConstellation from '../InteractiveConstellation';
import constellationImage from '../../assets/images/myconst.png';

const Me = () => {
  return (
    <div id='me' className='container me-page'>
      <div className='portrait-zone'>
        <InteractiveConstellation imageSrc={constellationImage} />
      </div>
    </div>
  );
};

export default Me;

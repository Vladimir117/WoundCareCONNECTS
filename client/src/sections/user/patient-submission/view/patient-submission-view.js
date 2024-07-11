import styles from 'src/style'
import Main from '../main';

const PatientSubmissionView = () => {
  return (
    <>
      <div className={`${styles.paddingX} ${styles.flexStart} font-manrope`}>
        <div className={`${styles.boxWidth} py-[48px] sm:py-[70px]`}>
          <Main />
        </div>
      </div>
    </>
  );
};

export default PatientSubmissionView;
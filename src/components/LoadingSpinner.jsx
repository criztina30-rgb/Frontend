export default function LoadingSpinner({ fullPage = false, size = 'md' }) {
  return (
    <div className={`spinner-wrapper ${fullPage ? 'spinner-wrapper--full' : ''}`}>
      <div className={`spinner spinner--${size}`}></div>
    </div>
  );
}

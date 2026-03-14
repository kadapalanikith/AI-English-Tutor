/**
 * Reusable Card component.
 * @param {{ children: React.ReactNode; className?: string }} props
 */
const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>{children}</div>
);

export default Card;

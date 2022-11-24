import Spinner from 'react-bootstrap/Spinner';

export default function Loading() {
	return (
		<Spinner animation="grow" variant="primary">
			<span className="visually-hidden">Loading...</span>
		</Spinner>
	);
}
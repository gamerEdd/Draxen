import {useParams} from 'react-router-dom';
import Personalizador from './Personalizador';
export default function ProductoDetalle(){const {id}=useParams();return <Personalizador key={id} productId={id}/>;}

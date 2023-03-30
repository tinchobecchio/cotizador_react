
const Resumen = ({datos}) => {

    // extraer datos
    const {marca, year, plan} = datos

    if(marca === '' || year === '' || plan === '') return null



    return (
        <>
            <h2>Resumen de Cotización</h2>
            <ul>
                <li>Marca: {marca}</li>
                <li>Año del auto: {year}</li>
                <li>Plan: {plan}</li>
            </ul>
        </>
    );
}
 
export default Resumen;
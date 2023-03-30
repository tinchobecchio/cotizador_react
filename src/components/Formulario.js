import { useState } from "react";
import styled from "@emotion/styled";
import { obtenerDiferenciaYear, calcularMarca, obtenerPlan } from '../helper'
import PropTypes from "prop-types";

const Campo = styled.div`
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
`
const Label = styled.label`
    flex: 0 0 100px;
`
const Select = styled.select`
    display: block;
    width: 100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    -webkit-appearance: none;
`
const InputRadio = styled.input`
    margin:0 1rem;
`
const Boton = styled.button`
    background-color: #00838f;
    font-size: 16px;
    width: 100%;
    padding: 1rem;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
    transition: background-color 0.3s ease;
    margin-top: 2rem;

    &:hover {
        background-color: #26c6da;
        cursor: pointer;
    }
`
const Error = styled.div`
    background-color: red;
    color: white;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
    
`




const Formulario = ({guardarResumen, guardarCargando}) => {

    const [ datos, guardarDatos] = useState({
        marca: '',
        year: '',
        plan: ''
    })
    const [error, guardarError] = useState(false)

    // extraer los valores del state
    const { marca, year, plan } = datos

    // Leer los datos del formulario y colocarlos en el state
    const obtenerInfo = e => {
        guardarDatos({
            ...datos,
            [e.target.name]: e.target.value
        })
    }

    // cuando el usuario presiona cotizar
    const cotizarSeguro = e => {
        e.preventDefault()
        
        if(marca.trim() === '' || year.trim() === '' || plan.trim() === '') {
            guardarError(true)
            return
        }
        guardarError(false)

        // Una base de 2000 (lo que sale el seguro)
        let resultado = 4000

        // obtener la diferencia de años
        let diferencia = obtenerDiferenciaYear(year)
        
        // Establezco el minimo que se cobra, sino se sigue aplicando el 3% y queda en negativo
        if(diferencia > 30) {
            diferencia = 30
        }

        // por cada año hay que restar el 3%
        resultado -= (( diferencia * 3 ) * resultado) / 100


        // Americano 15%
        // Asiatico 5%
        // Europeo 30%
        resultado = resultado * calcularMarca(marca)


        // Basico aumenta 20%
        // Completo aumenta 50%
        resultado = parseFloat( obtenerPlan(plan) * resultado ).toFixed(2)
       
        // Activar spinner
        guardarCargando(true)

        setTimeout(() => {
            // Desactivar spinner
            guardarCargando(false)
            // pasar al state resumen
            guardarResumen({
                cotizacion: Number(resultado),
                datos
            })
        },3000)


    }

    // Para mostrar los años en los options
    const actualYear = new Date().getFullYear()
    let years = []
    for (let i = actualYear; i > 1949 ; i--) {
        years.push(i)
    }

    return (
        <form
            onSubmit={cotizarSeguro}
        >   
            { error ?  <Error>Todos los campos son obligatorios</Error>  :  null }
            <Campo>
                <Label>Marca</Label>
                <Select
                    name="marca"
                    value={marca}
                    onChange={obtenerInfo}
                >
                    <option value="">-- Seleccione --</option>
                    <option value="americano">Americano</option>
                    <option value="europeo">Europeo</option>
                    <option value="asiatico">Asiatico</option>
                </Select>
            </Campo>

            <Campo>
                <Label>Año</Label>
                <Select
                    name="year"
                    value={year}
                    onChange={obtenerInfo}
                >
                    <option value="">-- Seleccione --</option>
                    {years.map(y => {
                        return <option key={y} value={y}>{y}</option>
                    })}
                </Select>
            </Campo>

            <Campo>
                <Label>Plan</Label>
                <InputRadio 
                    type="radio"
                    name="plan"
                    value='basico'
                    checked={plan === 'basico'}
                    onChange={obtenerInfo}
                /> Básico

                <InputRadio 
                    type="radio"
                    name="plan"
                    value='completo'
                    checked={plan === 'completo'}
                    onChange={obtenerInfo}
                /> Completo
            </Campo>
            <Boton type="submit">Cotizar</Boton>
        </form>
    );
}
 
Formulario.propTypes = {
    guardarResumen: PropTypes.func.isRequired,
    guardarCargando: PropTypes.func.isRequired
}
export default Formulario;
import { useState, useEffect } from "react";
import CategoriaContext from "./CategoriaContext";
import {
    getCategoriasAPI, getCategoriaPorCodigoAPI,
    deleteCategoriaAPI, cadastraCategoriaAPI
} from "../../../servicos/CategoriaServico";
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../comuns/Carregando";
import WithAuth from "../../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";

function Categoria() {

    let navigate = useNavigate();

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({ codigo: "", nome: "" });

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({
            codigo: 0,
            nome: ""
        });
    }

    const editarObjeto = async codigo => {
        try {
            setObjeto(await getCategoriaPorCodigoAPI(codigo));
            setEditar(true);
            setAlerta({ status: "", message: "" });
        } catch (err) {
            window.location.reload();
            navigate("login", { replace: true });
        }
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            let retornoAPI = await cadastraCategoriaAPI(objeto, metodo);
            setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            window.location.reload();
            navigate("login", { replace: true });
        }
        recuperaCategorias();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    const [carregando, setCarregando] = useState(false);

    const recuperaCategorias = async () => {
        try {
            setCarregando(true);
            setListaObjetos(await getCategoriasAPI());
            setCarregando(false);
        } catch (err) {
            window.location.reload();
            navigate("login", { replace: true });
        }
    }

    const remover = async codigo => {
        if (window.confirm('Deseja remover este objeto?')) {
            try {
                let retornoAPI = await deleteCategoriaAPI(codigo);
                setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
                recuperaCategorias();
            } catch (err) {
                window.location.reload();
                navigate("login", { replace: true });
            }
        }
    }

    useEffect(() => {
        recuperaCategorias();
    }, []);

    return (
        <CategoriaContext.Provider value={{
            alerta, listaObjetos, remover,
            objeto, acaoCadastrar, handleChange, novoObjeto, editarObjeto
        }}>
            <Carregando carregando={carregando}>
                <Tabela />
            </Carregando>
            <Form />
        </CategoriaContext.Provider>
    )



}

export default WithAuth(Categoria);
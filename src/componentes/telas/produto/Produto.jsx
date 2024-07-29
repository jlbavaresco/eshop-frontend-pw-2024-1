import { useState, useEffect } from "react";
import ProdutoContext from "./ProdutoContext";
import { getCategoriasAPI } from "../../../servicos/CategoriaServico";
import {
    getProdutosAPI, getProdutoPorCodigoAPI,
    deleteProdutoAPI, cadastraProdutoAPI
} from "../../../servicos/ProdutoServico";
import Tabela from "./Tabela";
import Form from "./Form";
import Carregando from "../../comuns/Carregando";
import WithAuth from "../../../seguranca/WithAuth";
import { useNavigate } from "react-router-dom";

function Produto() {

    let navigate = useNavigate();

    const [alerta, setAlerta] = useState({ status: "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    const [listaCategorias, setListaCategorias] = useState([]);
    const [editar, setEditar] = useState(false);
    const [objeto, setObjeto] = useState({
        codigo: "", nome: "",
        descricao: "", quantidade_estoque: "",
        valor: "", ativo: "", data_cadastro: new Date().toISOString().slice(0, 10),
        categoria: ""
    });

    const novoObjeto = () => {
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({
            codigo: "", nome: "",
            descricao: "", quantidade_estoque: "",
            valor: "", ativo: "", data_cadastro: new Date().toISOString().slice(0, 10),
            categoria: ""
        });
    }

    const editarObjeto = async codigo => {
        try {
            setObjeto(await getProdutoPorCodigoAPI(codigo));
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
            let retornoAPI = await cadastraProdutoAPI(objeto, metodo);
            setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            window.location.reload();
            navigate("login", { replace: true });
        }
        recuperaProdutos();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    const [carregando, setCarregando] = useState(false);

    const recuperaProdutos = async () => {
        try {
            setCarregando(true);
            setListaObjetos(await getProdutosAPI());
            setCarregando(false);
        } catch (err) {
            window.location.reload();
            navigate("login", { replace: true });
        }
    }

    const recuperaCategorias = async () => {
        try {
            setListaCategorias(await getCategoriasAPI());
        } catch (err) {
            window.location.reload();
            navigate("login", { replace: true });
        }
    }

    const remover = async codigo => {
        if (window.confirm('Deseja remover este objeto?')) {
            try {
                let retornoAPI = await deleteProdutoAPI(codigo);
                setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
                recuperaProdutos();
            } catch (err) {
                window.location.reload();
                navigate("login", { replace: true });
            }
        }
    }

    useEffect(() => {
        recuperaProdutos();
        recuperaCategorias();
    }, []);

    return (
        <ProdutoContext.Provider value={{
            alerta, listaObjetos, remover,
            objeto, acaoCadastrar, handleChange, novoObjeto, editarObjeto,
            listaCategorias
        }}>
            <Carregando carregando={carregando}>
                <Tabela />
            </Carregando>
            <Form />
        </ProdutoContext.Provider>
    )



}

export default WithAuth(Produto);
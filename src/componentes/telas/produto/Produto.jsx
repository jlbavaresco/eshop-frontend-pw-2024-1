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

function Produto() {

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
        setObjeto(await getProdutoPorCodigoAPI(codigo));
        setEditar(true);
        setAlerta({ status: "", message: "" });
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
            console.log(err);
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
        setCarregando(true);
        setListaObjetos(await getProdutosAPI());
        setCarregando(false);
    }

    const recuperaCategorias = async () => {
        setListaCategorias(await getCategoriasAPI());
    }

    const remover = async codigo => {
        if (window.confirm('Deseja remover este objeto?')) {
            let retornoAPI = await deleteProdutoAPI(codigo);
            setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
            recuperaProdutos();
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

export default Produto;
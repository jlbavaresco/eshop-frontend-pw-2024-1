import { useContext } from "react";
import ProdutoContext from "./ProdutoContext";
import Alerta from "../../comuns/Alerta";
import CampoEntrada from "../../comuns/CampoEntrada";
import Dialogo from "../../comuns/Dialogo";
import CampoSelect from "../../comuns/CampoSelect";
function Form() {

    const { objeto, handleChange, acaoCadastrar, alerta, listaCategorias }
        = useContext(ProdutoContext);

    return (
        <Dialogo id="modalEdicao" titulo="Produto"
            idform="formulario" acaoCadastrar={acaoCadastrar}>
            <Alerta alerta={alerta} />
            <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                placeholder="" requerido="false"
                name="codigo" value={objeto.codigo} onchange={handleChange}
                msgvalido="" msginvalido=""
                readonly={true} />
            <CampoEntrada id="txtNome" label="Nome" tipo="text"
                placeholder="Informe o nome" requerido="true"
                name="nome" value={objeto.nome} onchange={handleChange}
                msgvalido="Campo nome OK" msginvalido="Informe o nome"
                readonly={false} />
            <CampoEntrada id="txtDescricao" label="Descrição" tipo="text"
                placeholder="Informe a descrição" requerido="true"
                name="descricao" value={objeto.descricao} onchange={handleChange}
                msgvalido="Campo descrição OK" msginvalido="Informe a descrição"
                readonly={false} />
            <CampoEntrada id="txtEstoque" label="Estoque" tipo="number"
                placeholder="Informe o estoque" requerido="true"
                name="quantidade_estoque" value={objeto.quantidade_estoque}
                onchange={handleChange}
                msgvalido="Campo estoque OK" msginvalido="Informe a quantidade em estoque"
                readonly={false} />
            <CampoEntrada id="txtValor" label="Valor" tipo="number"
                placeholder="Informe o valor" requerido="true"
                name="valor" value={objeto.valor}
                onchange={handleChange}
                msgvalido="Campo valor OK" msginvalido="Informe o valor"
                readonly={false} />
            <CampoSelect id="selectAtivo" label="Ativo"
                requerido="true"
                name="ativo" value={objeto.ativo}
                onchange={handleChange}
                msgvalido="Campo ativo OK" msginvalido="Informe se está ativo"
                readonly={false}>
                <option value={true}>SIM</option>
                <option value={false}>NÃO</option>
            </CampoSelect>
            <CampoSelect id="selectCategoria" label="Categoria"
                requerido="true"
                name="categoria" value={objeto.categoria}
                onchange={handleChange}
                msgvalido="Campo categoria OK" msginvalido="Informe a categoria"
                readonly={false}>
                {
                    listaCategorias.map((cat) => (
                        <option value={cat.codigo} key={cat.codigo}>{cat.nome}</option>
                    ))
                }
            </CampoSelect>
            <CampoEntrada id="txtData" label="Data de cadastro" tipo="date"
                placeholder="Informe a data de cadastro" requerido="true"
                name="data_cadastro" value={objeto.data_cadastro}
                onchange={handleChange}
                msgvalido="Campo data de cadastro OK" msginvalido="Informe a data de cadastro"
                readonly={false} />
        </Dialogo>
    )
}

export default Form;
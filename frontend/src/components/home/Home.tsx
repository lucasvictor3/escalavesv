import { Button, Divider, Modal, Input, message } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import psicologiaLogo from '../assets/logopsicologia.png';
import './Home.scss';
import { UserOutlined, MailOutlined, FormOutlined } from '@ant-design/icons';
import UserService from '../../lib/UserService';

const { TextArea } = Input;
const tabIndex = {
  0: 'Sobre',
  1: 'Instruções',
  2: 'Créditos',
  3: 'Contato',
};

interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Home: React.FunctionComponent = (): JSX.Element => {
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [modalContent, seteModalContent] = React.useState<JSX.Element | null>(
    null
  );
  const [contact, setContact] = React.useState<IContact>({
    email: '',
    name: '',
    subject: '',
    message: '',
  });

  const sendEmail = () => {
    if (
      contact.email.trim() === '' ||
      contact.name.trim() === '' ||
      contact.subject.trim() === '' ||
      contact.message.trim() === ''
    ) {
      message.warn('É preciso preencher todos os campos!', 5);
      return;
    }

    new UserService(null)
      .sendEmail(contact)
      .then((res) => {
        setEmailSent(true);
        message.success('Mensagem enviada!', 3);
        setTimeout(() => {
          setIsModalVisible(false);
          seteModalContent(null);
        }, 3000);
      })
      .catch((err) => {
        message.error(
          'Erro ao enviar mensagem, tente novamente em alguns instantes.',
          3
        );
      });
  };

  return (
    <div className="home-main">
      <div className="home-menu">
        <p
          className="menu-option"
          onClick={(e) => {
            setIsModalVisible(true);
            setSelectedTab(0);
            seteModalContent(
              <div className="modal-content">
                <p className="modal-main-text">
                  A "Escala VESV" é uma Escala de Avaliação do Vazio Existencial
                  e Sentido da Vida, inspirando-se em estudos da Logoterapia e
                  Análise Existencial, é um instrumento que se propõe contribuir
                  com o processo de Avaliação psicológica. O público alvo é
                  jovens e adultos pertencentes à faixa etária de 18 a 59 anos.
                  Considera-se que essa escala pode também ser visualizada como
                  um meio preventivo de modo que a pessoa possa tornar
                  consciente suas fragilidades e potencialidades facilitando o
                  processo de tomada de decisões. Além disso, após identificadas
                  as demandas psicológicas, considerando a área clínica, o
                  psicólogo poderá contribuir de maneira efetiva e diretiva no
                  tratamento das pessoas que se encontram em tratamento
                  psicoterápico.
                </p>
              </div>
            );
          }}
        >
          Sobre
        </p>
        <Divider />
        <p
          className="menu-option"
          onClick={(e) => {
            setIsModalVisible(true);
            setSelectedTab(1);
            seteModalContent(
              <div className="modal-content">
                <p className="modal-main-text">
                  Prezado Psicólogo: A utilização do aplicativo da Escala VESV
                  será orientada pelo próprio aplicativo, podendo tirar alguma
                  dúvida do paciente quando necessário. Além disso, é importante
                  a observância das reações e comportamento do paciente durante
                  a execução do aplicativo. Ressalta-se que todas as informações
                  necessárias para uso do aplicativo estão em uma única tela; o
                  aplicativo é composto por 17 itens, e é um aplicativo de fácil
                  usabilidade.
                </p>
              </div>
            );
          }}
        >
          Instruções
        </p>
        <Divider />
        <p
          className="menu-option"
          onClick={(e) => {
            setIsModalVisible(true);
            setSelectedTab(2);
            seteModalContent(
              <div className="modal-content">
                <p className="modal-main-text">
                  Direitos Intelectuais: Profª Draª Elaine Custódio Rodrigues
                  Gusmão (UFCG) Gabriela Stéfany Alves de Lima (Graduanda em
                  Psicologia - UFCG) Direitos de Produção e desenvolvimento:
                  Lucas Victor Silva Araújo (Graduando em Ciência da Computação
                  - UFCG).
                </p>
                <p className="modal-main-text">
                  Apoio: Profª Draª Elaine Custódio Rodrigues Gusmão (Núcleo de
                  Pesquisa em Psicologia e Intervenções Interdisciplinares -
                  Universidade Federal de Campina Grande/UFCG). Coordenação de
                  Aperfeiçoamento de Pessoal de Nível Superior (CAPES).
                </p>
              </div>
            );
          }}
        >
          Créditos
        </p>
        <Divider />
        <p
          className="menu-option"
          onClick={(e) => {
            setIsModalVisible(true);
            setSelectedTab(3);
          }}
        >
          Contato
        </p>
        <Divider />
        <p
          onClick={(event) => {
            history.push('/login');
          }}
          className="menu-option"
        >
          Entrar
        </p>
      </div>
      <div style={{ display: 'inline-grid' }}>
        <img
          className="home-logo"
          alt="psicologia"
          src={psicologiaLogo}
          width={340}
        ></img>
        <p className="home-logo-subtitle">Crie sua conta grátis!</p>
        <Button
          onClick={(event) => {
            history.push('/login');
          }}
          className="register-button-home"
          type="primary"
        >
          Cadastrar
        </Button>
      </div>
      <Modal
        title={<p style={{ fontSize: '1.3rem' }}>{tabIndex[selectedTab]}</p>}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          seteModalContent(null);
          setEmailSent(false);
        }}
        footer={null}
      >
        {selectedTab === 3 ? (
          <div className="modal-content">
            <p className="modal-main-text">
              Entraremos em contato o mais rápido possivel. Agradecemos desde
              já. Por favor, preencha corretamente TODOS os campos.
            </p>
            <Input
              style={{ marginTop: '0.4rem' }}
              placeholder="Nome"
              size="large"
              value={contact.name}
              onChange={(e) => {
                console.log(e.currentTarget.value);
                let teste = { ...contact, name: e.currentTarget.value };
                setContact(teste);
              }}
              prefix={<UserOutlined />}
            />

            <Input
              style={{ marginTop: '0.4rem' }}
              placeholder="E-mail"
              size="large"
              value={contact.email}
              type="email"
              onChange={(e) =>
                setContact({ ...contact, email: e.currentTarget.value })
              }
              prefix={<MailOutlined />}
            />

            <Input
              style={{ marginTop: '0.4rem' }}
              placeholder="Assunto"
              size="large"
              value={contact.subject}
              onChange={(e) =>
                setContact({ ...contact, subject: e.currentTarget.value })
              }
              prefix={<FormOutlined />}
            />

            <Divider />
            <TextArea
              rows={6}
              value={contact.message}
              onChange={(e) =>
                setContact({ ...contact, message: e.currentTarget.value })
              }
              placeholder="Escreva aqui sua mensagem!"
            />
            {emailSent ? (
              <p className="email-sent-label">E-mail enviado com sucesso!</p>
            ) : (
              ''
            )}
            <div
              style={{
                margin: 'auto',
                marginTop: '1.5rem',
                width: 'max-content',
              }}
            >
              {' '}
              <Button
                onClick={(event) => {
                  sendEmail();
                }}
                className="send-button-home"
                type="primary"
              >
                Enviar
              </Button>
            </div>
          </div>
        ) : (
          modalContent
        )}
      </Modal>
    </div>
  );
};

export default Home;

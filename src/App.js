import React from "react";
import { Layout, Row, Col } from "antd";

//import route
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//import syles
import "./Assets/style/App.less";

//import pages
import NotFound from "./Pages/NotFound";
import Home from "./Pages/Home";
import Register from "./Pages/Register";

//import components
import Header from "./Components/Header/Header";

const { Content } = Layout;

function App() {
  return (
    <>
      <Layout>
        <Router>
          <Header />
          <Content style={{ marginTop: 70 }}>
            <Row>
              <Col
                justify="center"
                xs={{ span: 22, offset: 1 }}
                lg={{ span: 14, offset: 5 }}
              >
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/register" component={Register} />
                  <Route path="*" component={NotFound} />
                </Switch>
              </Col>
            </Row>
          </Content>
        </Router>
      </Layout>
    </>
  );
}

export default App;

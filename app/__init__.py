from flask import Flask
from flask_admin import Admin
from flask_admin.base import BaseView, expose

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Importa e registra as rotas
    from app.routes.home import bp as home_bp
    app.register_blueprint(home_bp)

    # Cria e configura o painel admin
    admin = Admin(app, name='Painel Ourinet', template_mode='bootstrap4')

    # View personalizada sem banco
    class MyView(BaseView):
        @expose('/')
        def index(self):
            return self.render('admin/custom.html')

    admin.add_view(MyView(name='Visão Geral'))

    return app

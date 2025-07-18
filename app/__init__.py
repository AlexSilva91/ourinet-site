from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Importa e registra as rotas
    from app.routes.home import bp as home_bp
    app.register_blueprint(home_bp)
    
    from app.routes.admin import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/admin')


    return app

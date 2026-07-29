from functools import wraps
from flask import request, jsonify, current_app
import jwt
from models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Token dikirim melalui header Authorization: Bearer <token>
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
                
        if not token:
            return jsonify({'error': 'Token autentikasi tidak ditemukan'}), 401
            
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'error': 'Pengguna tidak ditemukan'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Sesi telah berakhir, silakan login kembali'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token tidak valid'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated

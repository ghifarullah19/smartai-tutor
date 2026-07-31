from pydantic import BaseModel
from schemas.user_schema import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginResponse(BaseModel):
    message: str
    token: str
    user: UserResponse

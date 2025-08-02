from pydantic import BaseModel, Field


class ToolResponse(BaseModel):
    """ToolResponse model"""

    name: str = Field(description="Tool name")
    response: str = Field(description="Tool response")
    error: bool = Field(description="Error flag")

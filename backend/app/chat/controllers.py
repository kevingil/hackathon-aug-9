from flask import Blueprint, jsonify, request # type: ignore
from app.chat.services import ChatService # type: ignore
from app.chat.accounts.data import mock_user_data # type: ignore
import json

chat = Blueprint("chat", __name__)
chat_service = ChatService()


@chat.route("/message", methods=["POST"])
def send_message():
    """Send a message to the AI agent and get a streaming response."""
    try:
        data = request.get_json()
        message = data.get("message")
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
            
        # Get response from agent
        response_data = chat_service.process_message(message)
        
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to process message: {str(e)}"}), 500


@chat.route("/health", methods=["GET"])
def health_check():
    """Simple health check for the chat service."""
    return jsonify({"status": "healthy", "service": "chat"}), 200


@chat.route("/financial-data", methods=["GET"])
def get_financial_data():
    """Get financial data for the current user."""
    try:
        # For now, return the first user's data
        # In a real app, you'd get the user_id from the JWT token
        user_data = mock_user_data[0] if mock_user_data else None
        
        if not user_data:
            return jsonify({"error": "No financial data found"}), 404
        
        # Convert to dict format for JSON serialization
        user_dict = {
            "id": user_data.id,
            "accounts": []
        }
        
        for account in user_data.accounts:
            account_dict = {
                "id": account.id,
                "name": account.name,
                "balance": account.balance,
                "expenses": [{"id": e.id, "amount": e.amount, "category": e.category} for e in account.expenses],
                "deposits": [{"id": d.id, "amount": d.amount, "category": d.category} for d in account.deposits]
            }
            user_dict["accounts"].append(account_dict)
        
        return jsonify({"success": True, "data": user_dict}), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch financial data: {str(e)}"}), 500

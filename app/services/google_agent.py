from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from app.core.workflows.ingestion_workflow.agent import root_agent
from app.core.utils.agent_workflow_utils import (
    call_agent_async,
    add_user_query_to_history
)

session_service = InMemorySessionService()

initial_state = {
    "user_name": "City Graph User proxy",
    "interaction_history": [],
}

async def ingestion_pipeline():
    APP_NAME = "City Graph"
    USER_ID = "aiwithbrandon" # not sure which user id to use

    new_session = session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        state=initial_state,
    )
    SESSION_ID = new_session.id
    print(f"Created new session: {SESSION_ID}")

    runner = Runner(
        agent=root_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )

    user_input = "Fetch recent news articles and social media posts related to traffic in Bangalore."

    add_user_query_to_history(
            session_service, APP_NAME, USER_ID, SESSION_ID, user_input
        )
    await call_agent_async(runner, USER_ID, SESSION_ID, user_input)

    final_session = session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    print("\nFinal Session State:")
    for key, value in final_session.state.items():
        print(f"{key}: {value}")
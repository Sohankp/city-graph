from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from app.core.workflows.ingestion_workflow.sub_agents.retrieval_agent.agent import retrieval_agent
from app.core.utils.agent_workflow_utils import (
    call_agent_async,
    add_user_query_to_history
)

session_service = InMemorySessionService()

initial_state = {
    "user_name": "City Graph",
    "interaction_history": [],
}

async def extraction_pipeline(query:str):
    APP_NAME = "City Graph"
    USER_ID = "aiwithbrandon"
    new_session = await session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        state=initial_state,
    )
    SESSION_ID = new_session.id
    print(f"Created new session: {SESSION_ID}")
    runner = Runner(
        agent=retrieval_agent,
        app_name=APP_NAME,
        session_service=session_service,
    )
    user_input = query

    await add_user_query_to_history(
            session_service, APP_NAME, USER_ID, SESSION_ID, user_input
        )
    
    await call_agent_async(runner, USER_ID, SESSION_ID, user_input)

    final_session = await session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    print("\nFinal Session State:")
    interaction_history = final_session.state.get("interaction_history", [])
    print("Interaction History:", interaction_history)
    for key, value in final_session.state.items():
        print(f"{key}: {value}")

    # Return the agent's response from the last interaction
    if interaction_history and 'response' in interaction_history[-1]:
        return interaction_history[-1]['response']
    return None
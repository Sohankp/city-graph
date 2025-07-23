from app.services.graph_service.graph_client import graphiti

async def retrieve_from_graph(query:str)-> str:
    """Retrieves data from the graph based on the provided query and optional node UUId"""
    print(f"Querying the graph with: {query}")

    # await graphiti.build_indices_and_constraints()
    response_dict ={}
    results =[]
    print("Retrieving data from the graph...")
    # if(node_uuid):
    #     reuslts = await graphiti.search(query, node_uuid)
    # else:
    results = await graphiti.search(query)
    print(results, 'results')
    if not results:
        return "No results found for the query."
    else:
        for result in results:
            print(f'UUID: {result.uuid}')
            print(f'Fact: {result.fact}')
            if hasattr(result, 'valid_at') and result.valid_at:
                print(f'Valid from: {result.valid_at}')
            if hasattr(result, 'invalid_at') and result.invalid_at:
                print(f'Valid until: {result.invalid_at}')
            print('---')
            response_dict[result.uuid] = {
                "fact": result.fact,
                "valid_at": result.valid_at if hasattr(result, 'valid_at') else None,
                "invalid_at": result.invalid_at if hasattr(result, 'invalid_at') else None
            }
        print(response_dict,'response_dict')
        return str(response_dict)
    
    



    
import asyncio
from update_graph import update_episode

ep2 = """
There was a power outage in Indiranagar, with a reported severity of high. 
Nearby areas like Domlur and Ulsoor might also be affected. 
The source of this information is BESCOM Twitter handle.
"""

if __name__ == "__main__":
    asyncio.run(update_episode(ep2))

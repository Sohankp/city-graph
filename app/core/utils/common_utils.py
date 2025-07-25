import requests


def call_api(url, method='GET', params=None, data=None, headers=None, timeout=30):
    """
    Calls an API endpoint.

    Args:
        url (str): The API URL.
        method (str): HTTP method ('GET', 'POST', etc.).
        params (dict, optional): URL query parameters.
        data (dict, optional): Data to send in the body (for POST/PUT).
        headers (dict, optional): HTTP headers.
        timeout (int, optional): Timeout in seconds.

    Returns:
        dict: JSON response from the API.
    """
    try:
        response = requests.request(
            method=method,
            url=url,
            params=params,
            json=data,
            headers=headers,
            timeout=timeout
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {'error': str(e)}
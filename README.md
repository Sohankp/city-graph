# City Graph

## Setup Instructions

Follow these steps to set up your development environment:

### 1. Create a Virtual Environment (Python 3.11)

```sh
python3.11 -m venv venv
```

### 2. Activate the Virtual Environment

- **Windows:**
    ```sh
    venv\Scripts\activate
    ```
- **macOS/Linux:**
    ```sh
    source venv/bin/activate
    ```

### 3. Create a `.env` File

Create a `.env` file in the project root directory and add your environment variables as needed. Example:

```
KEY=your_value
```

### 4. Install Requirements

```sh
pip install -r requirements.txt
```

### 5. Run the Application

Start the FastAPI development server with:

```sh
fastapi dev app/main.py
```
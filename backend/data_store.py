# Global store for shared data
satellite_data = {}

def set_chunks(data) -> None:
    global satellite_data
    satellite_data = data
    

def get_chunks():
    return satellite_data
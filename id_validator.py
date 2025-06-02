def validate_sa_id(id_number):
    if len(id_number) != 13 or not id_number.isdigit():
        return False
    # Add checksum validation here
    return True

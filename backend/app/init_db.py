from app.db import Base, engine
from app.models import Evidence, Finding, Scan, TrustScore


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    initialize_database()
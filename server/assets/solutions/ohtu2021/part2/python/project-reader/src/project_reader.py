from urllib import request
from project import Project
import toml

class ProjectReader:
    def __init__(self, url):
        self._url = url

    def get_project(self):
        # tiedoston merkkijonomuotoinen sisältö
        content = request.urlopen(self._url).read().decode("utf-8")
        toml_hash = toml.loads(content)
        project_data = toml_hash['tool']['poetry']

        # deserialisoi TOML-formaatissa oleva merkkijono ja muodosta Project-olio sen tietojen perusteella
        return Project(project_data['name'], project_data['description'], project_data['dependencies'], project_data['dev-dependencies'])

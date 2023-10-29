class Project:
    def __init__(self, name, description, dependencies, dev_dependencies, authors, license):
        self.name = name
        self.description = description
        self.dependencies = dependencies
        self.dev_dependencies = dev_dependencies
        self.authors = authors
        self.license = license

    def _stringify(self, strings):
        return ", ".join(strings) if len(strings) > 0 else "-"

    def _lined_stringify(self, strings):
        intended_strings = [ f"- {s}" for s in strings ]
        return "\n".join(intended_strings) if len(strings) > 0 else "-"
    
    def __str__(self):
        return (
            f"Name: {self.name}"
            f"\nDescription: {self.description or '-'}"
            f"\nLicense: {self.license or '-'}"
            "\n"
            f"\nAuthors:\n{self._lined_stringify(self.authors)}"
            "\n"
            f"\nDependencies:\n{self._lined_stringify(self.dependencies)}"
            "\n"
            f"\nDevelopment dependencies:\n{self._lined_stringify(self.dev_dependencies)}"
        )

# Genetic Algorithm for Class Partitioning

> As a project assignment of CS454 AI Based Software Engineering, KAIST (Fall 2021)

This tool helps partition a group of students into classes with the least standard deviation between
each class's total age, which is used as the fitness. However, another crucial condition is that, the number of boys and girls in each class should be distributed as eqaully as possible. 

This tool is constructed using genetic algorithm technique, creating `K` more breeds and keeping the best `K` (population capacity) individuals at each step.

Visit [this link](https://class-partition-ga.vercel.app/) for the live demo. The detailed description of the project can be found in the PDF file.

## Instructions

- Add a new student to the list: You can add new student to the list by directly input the student's information to the first row of the left table. To change the gender, you can toggle the blue/pink icon in front of the name.

- Add a batch of students: To add multiple students at a time, you should prepare an Excel document (only `.xlsx` is supported). The file should contain 3 columns: gender (either `M` or `F`), name, and age (in months). The file can be uploaded by clicking the "Import" button on the left panel. A sample file `sample.xlsx` is provided for testing.

- Search for the solution: By clicking the button "Evolve", the tool starts to search for the best solution (one with the least fitness value) with the given parameters (to be mentioned afterwards). The graph will be shown, presenting the fitness of the best individual of the population at each step. The bottom-right table will show the best solution. You can click the evolve button again to reproduce the results with a different seed.

- Adjust the parameter: Three parameters are available for adjustment: steps (the number of generation), rooms (number of classes), and capacity (the maximum capacity of the population). To properly apply the effect, the "Clear" button should be clicked before proceeding to search for a new solution.

- Reset the environment: Clicking the "Reset" button will erase all students' data and the results.
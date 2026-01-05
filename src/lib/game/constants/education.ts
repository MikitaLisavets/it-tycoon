
export interface Quiz {
    question: string;
    options: string[];
    answer: number; // index
}

export interface EducationPart {
    id: string;
    title: string;
    cost: number;
    duration: number; // in seconds
    quizzes: Quiz[];
}

export interface EducationTrack {
    id: string;
    title: string;
    parts: EducationPart[];
    requirements?: {
        education?: string; // ID of previous education
    };
}

export const EDUCATION_TRACKS: EducationTrack[] = [
    {
        id: 'school',
        title: 'High School',
        parts: [
            {
                id: 'school_part_1',
                title: 'Mathematics Basics',
                cost: 50,
                duration: 10,
                quizzes: [
                    { question: 'If 2x + 5 = 15, what is x?', options: ['3', '5', '7', '10'], answer: 1 },
                    { question: 'What is 15% of 200?', options: ['20', '30', '40', '25'], answer: 1 },
                    { question: 'Solve for y: 3y - 6 = 9', options: ['3', '4', '5', '6'], answer: 2 },
                    { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], answer: 2 },
                    { question: 'If a triangle has angles 90° and 45°, what is the third angle?', options: ['30°', '45°', '60°', '90°'], answer: 1 },
                    { question: 'What is 7 cubed?', options: ['343', '243', '49', '443'], answer: 0 },
                    { question: 'Simplify: (x^2 * x^3)', options: ['x^5', 'x^6', '2x^5', 'x'], answer: 0 },
                    { question: 'What is the perimeter of a square with side 5?', options: ['20', '25', '15', '10'], answer: 0 },
                    { question: 'If 4 apples cost $2, how much for 10?', options: ['$4', '$5', '$6', '$8'], answer: 1 },
                    { question: 'What is the next prime number after 7?', options: ['9', '10', '11', '13'], answer: 2 }
                ]
            },
            {
                id: 'school_part_2',
                title: 'Logic & Reasoning',
                cost: 75,
                duration: 15,
                quizzes: [
                    { question: 'Which comes next: 2, 4, 8, 16...?', options: ['24', '32', '30', '18'], answer: 1 },
                    { question: 'A is father of B, but B is not son of A. Who is B?', options: ['Uncle', 'Daughter', 'Grandson', 'Wife'], answer: 1 },
                    { question: 'Which word does not belong?', options: ['Apple', 'Banana', 'Carrot', 'Grape'], answer: 2 },
                    { question: 'If all Zorks are Gorks, and some Gorks are Torks...', options: ['All Zorks are Torks', 'Some Zorks might be Torks', 'No Zorks are Torks', 'None'], answer: 1 },
                    { question: 'Complete the series: J, F, M, A, M, ...', options: ['J', 'J', 'S', 'O'], answer: 0 },
                    { question: 'Finger is to Hand as Toe is to ...', options: ['Foot', 'Knee', 'Ankle', 'Leg'], answer: 0 },
                    { question: 'Which is heavier: a pound of lead or a pound of feathers?', options: ['Lead', 'Feathers', 'Equal', 'Depends'], answer: 2 },
                    { question: 'Day before yesterday was Saturday. What day is tomorrow?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Monday'], answer: 0 },
                    { question: 'Identify the pattern: 1, 4, 9, 16, ?', options: ['20', '24', '25', '30'], answer: 2 },
                    { question: 'Book is to Chapter as House is to ...', options: ['Roof', 'Room', 'Door', 'Window'], answer: 1 }
                ]
            },
            {
                id: 'school_part_3',
                title: 'Natural Sciences',
                cost: 100,
                duration: 20,
                quizzes: [
                    { question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'O2', 'NaCl'], answer: 0 },
                    { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], answer: 2 },
                    { question: 'What gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'], answer: 2 },
                    { question: 'What is the hardest natural substance?', options: ['Gold', 'Iron', 'Diamond', 'Platinum'], answer: 2 },
                    { question: 'What is the center of an atom called?', options: ['Electron', 'Proton', 'Nucleus', 'Neutron'], answer: 2 },
                    { question: 'What force keeps us on the ground?', options: ['Magnetism', 'Friction', 'Gravity', 'Tension'], answer: 2 },
                    { question: 'How many bones are in the adult human body?', options: ['206', '250', '180', '300'], answer: 0 },
                    { question: 'What is the closest star to Earth?', options: ['Proxima Centauri', 'Sirius', 'The Sun', 'Alpha Centauri'], answer: 2 },
                    { question: 'What is the freezing point of water in Celsius?', options: ['0', '32', '100', '-273'], answer: 0 },
                    { question: 'Which animal group does a frog belong to?', options: ['Reptile', 'Mammal', 'Amphibian', 'Fish'], answer: 2 }
                ]
            },
            {
                id: 'school_part_4',
                title: 'Intro to Computers',
                cost: 150,
                duration: 25,
                quizzes: [
                    { question: 'What is the "brain" of a computer?', options: ['Hard Drive', 'RAM', 'CPU', 'Monitor'], answer: 2 },
                    { question: 'What does RAM stand for?', options: ['Random Access Memory', 'Read Access Memory', 'Run All Memory', 'Real Active Memory'], answer: 0 },
                    { question: 'Which is an input device?', options: ['Speaker', 'Monitor', 'Printer', 'Mouse'], answer: 3 },
                    { question: 'What is binary code made up of?', options: ['0s and 1s', 'A-Z', '1-9', 'Hexadecimal'], answer: 0 },
                    { question: 'Which key is used to copy text?', options: ['Ctrl+V', 'Ctrl+X', 'Ctrl+C', 'Alt+F4'], answer: 2 },
                    { question: 'What does a browser do?', options: ['Edits photos', 'Surfs the internet', 'Plays music', 'Scans viruses'], answer: 1 },
                    { question: 'What is a bug?', options: ['A virus', 'A hardware failure', 'An error in software', 'A feature'], answer: 2 },
                    { question: 'Which device stores data permanently?', options: ['RAM', 'Cache', 'Hard Drive', 'CPU'], answer: 2 },
                    { question: 'What does OS stand for?', options: ['Open Software', 'Operating System', 'Over System', 'Only Source'], answer: 1 },
                    { question: 'Which is NOT a programming language?', options: ['Python', 'Java', 'HTML', 'JPEG'], answer: 3 }
                ]
            }
        ]
    },
    {
        id: 'college',
        title: 'Technical College',
        requirements: { education: 'school' },
        parts: [
            {
                id: 'college_part_1',
                title: 'Computer Architecture',
                cost: 200,
                duration: 20,
                quizzes: [
                    { question: 'What does CPU stand for?', options: ['Central Process Unit', 'Computer Personal Unit', 'Central Processing Unit', 'Central Peripheral Unit'], answer: 2 },
                    { question: 'Where is data temporarily stored for quick access?', options: ['HDD', 'SSD', 'Cache', 'DVD'], answer: 2 },
                    { question: 'Which part provides power to the computer?', options: ['UPS', 'PSU', 'GPU', 'CPU'], answer: 1 },
                    { question: 'What connects all components together?', options: ['Motherboard', 'Keyboard', 'Monitor', 'Mouse'], answer: 0 },
                    { question: 'What is the standard port for connecting peripherals?', options: ['VGA', 'HDMI', 'USB', 'Ethernet'], answer: 2 },
                    { question: 'Which component processes graphics?', options: ['CPU', 'RAM', 'GPU', 'HDD'], answer: 2 },
                    { question: 'What is the main circuit board called?', options: ['Fatherboard', 'Motherboard', 'Sisterboard', 'Brotherboard'], answer: 1 },
                    { question: 'What does SSD stand for?', options: ['Solid State Drive', 'Super Speed Drive', 'System Storage Disk', 'Standard State Disk'], answer: 0 },
                    { question: 'Which memory is volatile?', options: ['ROM', 'RAM', 'Flash', 'Hard Disk'], answer: 1 },
                    { question: 'What is the function of a fan?', options: ['To look cool', 'To cool components', 'To generate power', 'To make noise'], answer: 1 }
                ]
            },
            {
                id: 'college_part_2',
                title: 'Algorithms 101',
                cost: 300,
                duration: 25,
                quizzes: [
                    { question: 'What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ...?', options: ['10', '11', '12', '13'], answer: 3 },
                    { question: 'What is a sorting algorithm?', options: ['Organizes data', 'Deletes data', 'Creates data', 'Hides data'], answer: 0 },
                    { question: 'Which sort is generally slowest?', options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Heap Sort'], answer: 2 },
                    { question: 'What is a recursive function?', options: ['A function that calls itself', 'A broken loop', 'A duplicated code', 'A database query'], answer: 0 },
                    { question: 'Big O notation describes...', options: ['Code length', 'Performance/Complexity', 'File size', 'C compiler'], answer: 1 },
                    { question: 'Which search needs a sorted list?', options: ['Linear Search', 'Binary Search', 'Random Search', 'Depth First Search'], answer: 1 },
                    { question: 'What is "FIFO"?', options: ['First In First Out', 'Fast In Fast Out', 'File Input File Output', 'Fly In Fly Out'], answer: 0 },
                    { question: 'A "stack" uses which method?', options: ['FIFO', 'LIFO', 'GIGO', 'LILO'], answer: 1 },
                    { question: 'What is an infinite loop?', options: ['A really long loop', 'A loop that never ends', 'A circle', 'A crash'], answer: 1 },
                    { question: 'What is pseudo-code?', options: ['Fake code', 'Machine code', 'False code', 'Logic description'], answer: 3 }
                ]
            },
            {
                id: 'college_part_3',
                title: 'Web Development Basics',
                cost: 400,
                duration: 30,
                quizzes: [
                    { question: 'Which of these is used for styling web pages?', options: ['HTML', 'CSS', 'JavaScript', 'SQL'], answer: 1 },
                    { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HyperText Markdown Language', 'High Tech Modern Language', 'Home Tool Markup Language'], answer: 0 },
                    { question: 'Which tag makes text bold?', options: ['<bold>', '<b>', '<bb>', '<dark>'], answer: 1 },
                    { question: 'Which attribute provides link destination?', options: ['src', 'link', 'href', 'to'], answer: 2 },
                    { question: 'What is the "DOM"?', options: ['Document Object Model', 'Data Oriented Model', 'Disk Operating Mode', 'Digital Object Method'], answer: 0 },
                    { question: 'Which language makes pages interactive?', options: ['PHP', 'HTML', 'JavaScript', 'CSS'], answer: 2 },
                    { question: 'What tag is used for an image?', options: ['<pic>', '<img>', '<image>', '<src>'], answer: 1 },
                    { question: 'What does "www" stand for?', options: ['World Wide Web', 'World Wide Wares', 'Web World Wide', 'Wiki Wiki Web'], answer: 0 },
                    { question: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'color', 'foreground'], answer: 2 },
                    { question: 'What is a "div"?', options: ['A divider/container', 'A division sign', 'A developer', 'A diversion'], answer: 0 }
                ]
            },
            {
                id: 'college_part_4',
                title: 'Database Fundamentals',
                cost: 500,
                duration: 35,
                quizzes: [
                    { question: 'What does SQL stand for?', options: ['Structured Question Language', 'Simple Query Language', 'Structured Query Language', 'System Query Logic'], answer: 2 },
                    { question: 'Which command gets data?', options: ['GET', 'SELECT', 'FETCH', 'PULL'], answer: 1 },
                    { question: 'What uniquely identifies a record?', options: ['Primary Key', 'Foreign Key', 'Unique Index', 'Super Key'], answer: 0 },
                    { question: 'Which command deletes data?', options: ['REMOVE', 'DELETE', 'ERASE', 'DROP'], answer: 1 },
                    { question: 'What is a "table" in a database?', options: ['A piece of furniture', 'A collection of related data', 'A chart', 'A graph'], answer: 1 },
                    { question: 'Which command adds new data?', options: ['ADD', 'INSERT', 'PUT', 'NEW'], answer: 1 },
                    { question: 'What joins two strings in SQL?', options: ['CONCAT', 'JOIN', 'LINK', 'MERGE'], answer: 0 },
                    { question: 'What is a relationship?', options: ['A connection between tables', 'A dating status', 'A math formula', 'A query type'], answer: 0 },
                    { question: 'Which command modifies data?', options: ['CHANGE', 'MODIFY', 'UPDATE', 'ALTER'], answer: 2 },
                    { question: 'What does CRUD stand for?', options: ['Create Read Update Delete', 'Code Run Undo Do', 'Copy Read Use Destroy', 'Create Run Update Do'], answer: 0 }
                ]
            },
            {
                id: 'college_part_5',
                title: 'Networking Essentials',
                cost: 600,
                duration: 40,
                quizzes: [
                    { question: 'Which protocol is used for web browsing?', options: ['FTP', 'SMTP', 'HTTP', 'SSH'], answer: 2 },
                    { question: 'What is an IP address?', options: ['Internet Protocol Address', 'Internal PC Address', 'Internet Phone Address', 'Inter Process Address'], answer: 0 },
                    { question: 'Which device connects networks?', options: ['Hub', 'Switch', 'Router', 'Repeater'], answer: 2 },
                    { question: 'What does LAN stand for?', options: ['Large Area Network', 'Local Area Network', 'Long Area Network', 'Live Area Network'], answer: 1 },
                    { question: 'What does DNS do?', options: ['Downloads files', 'Resolves names to IPs', 'Delivers email', 'Encrypts data'], answer: 1 },
                    { question: 'Which cable is most common?', options: ['Coaxial', 'Fiber', 'Ethernet', 'Phone'], answer: 2 },
                    { question: 'What is "Wi-Fi"?', options: ['Wireless Fidelity', 'Wide File', 'Wireless Field', 'Who Knows'], answer: 0 },
                    { question: 'What protects a private network?', options: ['Antivirus', 'Firewall', 'Password', 'Lock'], answer: 1 },
                    { question: 'What is "ping" used for?', options: ['Playing games', 'Testing connectivity', 'Sending email', 'Measuring speed'], answer: 1 },
                    { question: 'Which layer is the physical layer?', options: ['Layer 1', 'Layer 3', 'Layer 7', 'Layer 0'], answer: 0 }
                ]
            },
            {
                id: 'college_part_6',
                title: 'Operating Systems',
                cost: 700,
                duration: 45,
                quizzes: [
                    { question: 'Which of these is an open-source OS?', options: ['Windows', 'macOS', 'Linux', 'iOS'], answer: 2 },
                    { question: 'What is the core of an OS?', options: ['Shell', 'Kernel', 'GUI', 'Bootloader'], answer: 1 },
                    { question: 'What manages files?', options: ['File System', 'File Manager', 'Hard Drive', 'CPU'], answer: 0 },
                    { question: 'Which OS is made by Microsoft?', options: ['Linux', 'Windows', 'Android', 'macOS'], answer: 1 },
                    { question: 'What is multitasking?', options: ['Doing multiple things at once', 'Using multiple screens', 'Typing fast', 'Gaming'], answer: 0 },
                    { question: 'What provides the UI?', options: ['Shell', 'Kernel', 'API', 'Driver'], answer: 0 },
                    { question: 'What starts the computer?', options: ['BIOS/UEFI', 'OS', 'Word', 'The Button'], answer: 0 },
                    { question: 'What is a "driver"?', options: ['A chauffeur', 'Software for hardware', 'A game controller', 'A tool'], answer: 1 },
                    { question: 'Permissions control...', options: ['Who access files', 'Who buys the PC', 'Internet speed', 'Graphics'], answer: 0 },
                    { question: 'Which OS is mobile focused?', options: ['Windows Server', 'Android', 'Ubuntu', 'DOS'], answer: 1 }
                ]
            }
        ]
    },
    {
        id: 'university',
        title: 'University of Technology',
        requirements: { education: 'college' },
        parts: [
            {
                id: 'uni_part_1',
                title: 'Software Engineering',
                cost: 800,
                duration: 40,
                quizzes: [
                    { question: 'Which of these is a valid Big O notation for Binary Search?', options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'], answer: 1 },
                    { question: 'What does "agile" emphasize?', options: ['Documentation', 'Iterative development', 'Rigid planning', 'Long meetings'], answer: 1 },
                    { question: 'What is a "user story"?', options: ['A bedtime story', 'A feature description', 'A bug report', 'A database schema'], answer: 1 },
                    { question: 'What is "refactoring"?', options: ['Changing functionality', 'Improving code structure', 'Deleting code', 'Writing tests'], answer: 1 },
                    { question: 'What is "CI/CD"?', options: ['Continuous Integration/Deployment', 'Code In/Code Day', 'Computer Internal/Core Drive', 'Complex Interface/Common Design'], answer: 0 },
                    { question: 'What is "tech debt"?', options: ['Money owed for servers', 'Cost of shortcuts', 'A loan for a startup', 'Broken hardware'], answer: 1 },
                    { question: 'A "scrum master"...', options: ['Writes all the code', 'Facilitates the team', 'Pays salaries', 'Fixes bugs'], answer: 1 },
                    { question: 'What is "version control"?', options: ['Mind control', 'Tracking code changes', 'Managing versions of Windows', 'Controlling users'], answer: 1 },
                    { question: 'Which is a version control system?', options: ['Git', 'Got', 'Get', 'Gut'], answer: 0 },
                    { question: 'What is a "sprint"?', options: ['A short race', 'A set period of work', 'A fast download', 'A coding marathon'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_2',
                title: 'Advanced Data Structures',
                cost: 1000,
                duration: 50,
                quizzes: [
                    { question: 'Which data structure follows LIFO?', options: ['Queue', 'Linked List', 'Stack', 'Tree'], answer: 2 },
                    { question: 'A "Binary Tree" node has max...?', options: ['1 child', '2 children', '3 children', 'Any number'], answer: 1 },
                    { question: 'Which is faster for search?', options: ['Unsorted Array', 'Hash Map', 'Linked List', 'Stack'], answer: 1 },
                    { question: 'What is a "Hash Collision"?', options: ['Two keys, same hash', 'Two threads crashing', 'A disk error', 'A corrupt file'], answer: 0 },
                    { question: 'Which uses FIFO?', options: ['Stack', 'Queue', 'Array', 'Heap'], answer: 1 },
                    { question: 'What is a "Graph"?', options: ['A chart', 'A set of nodes and edges', 'A spreadsheet', 'A picture'], answer: 1 },
                    { question: 'Which is balanced?', options: ['AVL Tree', 'Linked List', 'Stack', 'Queue'], answer: 0 },
                    { question: 'Which is better for frequent inserts?', options: ['Array', 'Linked List', 'Stack', 'Queue'], answer: 1 },
                    { question: 'Complexity of Hash Map lookup?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 0 },
                    { question: 'What represents a network?', options: ['Stack', 'Queue', 'Graph', 'Tree'], answer: 2 }
                ]
            },
            {
                id: 'uni_part_3',
                title: 'Artificial Intelligence',
                cost: 1200,
                duration: 60,
                quizzes: [
                    { question: 'What is the Turing Test used to determine?', options: ['CPU Speed', 'Memory Capacity', 'Machine Intelligence', 'Network Latency'], answer: 2 },
                    { question: 'What is "Machine Learning"?', options: ['Robots walking', 'Systems learning from data', 'Teaching kids code', 'Building hardware'], answer: 1 },
                    { question: 'What is a "Neural Network"?', options: ['A brain scan', 'A computing model inspired by brains', 'A network of cables', 'A social network'], answer: 1 },
                    { question: 'What is "NLP"?', options: ['Natural Language Processing', 'New Laptop Parts', 'Network Link Protocol', 'No Long Programs'], answer: 0 },
                    { question: 'Who is a pioneer of AI?', options: ['Alan Turing', 'Steve Jobs', 'Bill Gates', 'Tim Berners-Lee'], answer: 0 },
                    { question: 'What is "Deep Learning"?', options: ['Learning while swimming', 'Multi-layered neural networks', 'Reading books', 'Studying hard'], answer: 1 },
                    { question: 'What is a "bot"?', options: ['A software application', 'A boat', 'A glitch', 'A virus'], answer: 0 },
                    { question: 'What is "Computer Vision"?', options: ['VR glasses', 'Computers "seeing" images', 'High res monitors', 'Eye tracking'], answer: 1 },
                    { question: 'Which is an AI assistant?', options: ['Siri', 'Word', 'Excel', 'Paint'], answer: 0 },
                    { question: 'What is "training data"?', options: ['Gym schedule', 'Data used to teach models', 'Video tutorials', 'Employee handbook'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_4',
                title: 'Compiler Design',
                cost: 1500,
                duration: 70,
                quizzes: [
                    { question: 'What converts high-level code to machine code?', options: ['Interpreter', 'Compiler', 'Debugger', 'Editor'], answer: 1 },
                    { question: 'What is "lexical analysis"?', options: ['Checking grammar', 'Breaking code into tokens', 'Optimizing loops', 'Linking files'], answer: 1 },
                    { question: 'What is "syntax analysis"?', options: ['Checking spelling', 'Checking grammar/structure', 'Checking runtime errors', 'Checking logic'], answer: 1 },
                    { question: 'What is an "AST"?', options: ['Abstract Syntax Tree', 'All Systems Test', 'Automated Source Tool', 'Advanced Software Tech'], answer: 0 },
                    { question: 'What is "optimization"?', options: ['Making code faster/smaller', 'Writing more code', 'Deleting code', 'Adding comments'], answer: 0 },
                    { question: 'What is a "linker"?', options: ['Combines object files', 'Connects to internet', 'Links pages', 'Connects cables'], answer: 0 },
                    { question: 'What is "intermediate code"?', options: ['Half-written code', 'Code between high/low level', 'Comments', 'Beta software'], answer: 1 },
                    { question: 'What is a "runtime error"?', options: ['Error usually happens during execution', 'Error during compelling', 'Typo in code', 'Hardware failure'], answer: 0 },
                    { question: 'Who designed C?', options: ['Dennis Ritchie', 'Bill Gates', 'Steve Jobs', 'Linus Torvalds'], answer: 0 },
                    { question: 'What is "JIT"?', options: ['Just In Time', 'Jump In There', 'Java Is Tight', 'Join It Today'], answer: 0 }
                ]
            },
            {
                id: 'uni_part_5',
                title: 'Distributed Systems',
                cost: 1800,
                duration: 80,
                quizzes: [
                    { question: 'What is a key characteristic of distributed systems?', options: ['Centralization', 'High Latency', 'Concurrency', 'Single Point of Failure'], answer: 2 },
                    { question: 'What is "scalability"?', options: ['Weighing a computer', 'Handling growth', 'Cleaning a screen', 'Measuring heat'], answer: 1 },
                    { question: 'What is "Load Balancing"?', options: ['Distributing traffic', 'Moving heavy servers', 'Charging batteries', 'Managing cables'], answer: 0 },
                    { question: 'What is the "CAP theorem"?', options: ['Consistency, Availability, Partition', 'Computer, Apple, Phone', 'Code, App, Program', 'Control, Access, Power'], answer: 0 },
                    { question: 'What is "latency"?', options: ['Delay', 'Speed', 'Bandwidth', 'Volume'], answer: 0 },
                    { question: 'What is "fault tolerance"?', options: ['Ignoring errors', 'Continuing despite failure', 'Blaming users', 'Preventing login'], answer: 1 },
                    { question: 'What is a "cluster"?', options: ['A group of servers', 'A mess', 'A cereal', 'A type of virus'], answer: 0 },
                    { question: 'What is "replication"?', options: ['Copying data', 'Deleting data', 'Encrypting data', 'Hiding data'], answer: 0 },
                    { question: 'What is "sharding"?', options: ['Breaking glass', 'Partitioning data', 'Sharing files', 'Cutting cables'], answer: 1 },
                    { question: 'What is "microservices"?', options: ['Small computers', 'Architecture style', 'Tiny bugs', 'Cheap software'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_6',
                title: 'Cybersecurity',
                cost: 2100,
                duration: 90,
                quizzes: [
                    { question: 'Which attack floods a network with traffic?', options: ['Phishing', 'SQL Injection', 'DDoS', 'XSS'], answer: 2 },
                    { question: 'What is "Phishing"?', options: ['Fishing for fish', 'Fraudulent emails', 'Network scanning', 'Password cracking'], answer: 1 },
                    { question: 'What is "Encryption"?', options: ['Scrambling data', 'Deleting data', 'Copying data', 'Sending data'], answer: 0 },
                    { question: 'What is a "Firewall"?', options: ['A burning wall', 'Network security system', 'Anti-virus', 'A heating unit'], answer: 1 },
                    { question: 'What is "Malware"?', options: ['Bad hardware', 'Malicious software', 'A broken mouse', 'Dust'], answer: 1 },
                    { question: 'What is "2FA"?', options: ['Too Fast Also', 'Two Factor Authentication', 'To Friends Always', 'Two File Access'], answer: 1 },
                    { question: 'What is a "White Hat"?', options: ['A chef', 'Ethical hacker', 'Bad hacker', 'A ghost'], answer: 1 },
                    { question: 'What is "Ransomware"?', options: ['Free software', 'Holds data hostage', 'Fast software', 'Backup tool'], answer: 1 },
                    { question: 'What is "Social Engineering"?', options: ['Building bridges', 'Manipulating people', 'Social media', 'Coding apps'], answer: 1 },
                    { question: 'What is a "VPN"?', options: ['Very Private Network', 'Virtual Private Network', 'Visual Public Net', 'Voice Phone Number'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_7',
                title: 'Cloud Computing',
                cost: 2500,
                duration: 100,
                quizzes: [
                    { question: 'Which is a service model of Cloud Computing?', options: ['SaaS', 'HaaS', 'WaaS', 'DaaS'], answer: 0 },
                    { question: 'What does "AWS" stand for?', options: ['Amazon Web Services', 'All Web Sites', 'Apple Web System', 'Advanced Web Source'], answer: 0 },
                    { question: 'What is "IaaS"?', options: ['Internet as a Service', 'Infrastructure as a Service', 'Intelligence as a Service', 'Image as a Service'], answer: 1 },
                    { question: 'What is "PaaS"?', options: ['Platform as a Service', 'Pay as a Service', 'Play as a Service', 'Phone as a Service'], answer: 0 },
                    { question: 'What is "serverless"?', options: ['No servers exist', 'Managed execution', 'Offline mode', 'Peer to peer'], answer: 1 },
                    { question: 'What is "virtualization"?', options: ['VR gaming', 'Creating virtual resources', 'Fake news', 'Dreaming'], answer: 1 },
                    { question: 'Who owns Azure?', options: ['Google', 'Amazon', 'Microsoft', 'IBM'], answer: 2 },
                    { question: 'What is a "hybrid cloud"?', options: ['Rain and sun', 'Public + Private cloud', 'Cloud + HDD', 'Mac + PC'], answer: 1 },
                    { question: 'What is "elasticity"?', options: ['Rubber bands', 'Auto-scaling resources', 'Flexible screens', 'Bouncing checks'], answer: 1 },
                    { question: 'What is a "container"?', options: ['A box', 'Isolated app package', 'A folder', 'A bucket'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_8',
                title: 'Master Thesis',
                cost: 3000,
                duration: 120,
                quizzes: [
                    { question: 'What is the primary goal of a thesis?', options: ['To copy others', 'To contribute new knowledge', 'To write long essays', 'To get a job'], answer: 1 },
                    { question: 'What is an "abstract"?', options: ['Modern art', 'Summary of paper', 'A difficult concept', 'A title'], answer: 1 },
                    { question: 'What is "citation"?', options: ['A speeding ticket', 'Referencing sources', 'A complement', 'A location'], answer: 1 },
                    { question: 'What is "methodology"?', options: ['Study of methods', 'Religious study', 'Math problem', 'Mythology'], answer: 0 },
                    { question: 'What is "peer review"?', options: ['Looking at friends', 'Expert evaluation', 'Proofreading', 'Spell check'], answer: 1 },
                    { question: 'What is "plagiarism"?', options: ['Eating plants', 'Stealing work', 'Playing games', 'Planning ahead'], answer: 1 },
                    { question: 'What is a "hypothesis"?', options: ['A fact', 'A proposed explanation', 'A lie', 'A questions'], answer: 1 },
                    { question: 'What is "data analysis"?', options: ['Deleting data', 'Interpreting data', 'Collecting dust', 'Writing code'], answer: 1 },
                    { question: 'What is a "defense"?', options: ['Fighting', 'Presenting/arguing thesis', 'Protecting PC', 'Football move'], answer: 1 },
                    { question: 'What comes after Master?', options: ['Bachelor', 'PhD', 'High School', 'Kindergarten'], answer: 1 }
                ]
            }
        ]
    }
];

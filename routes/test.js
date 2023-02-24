[
  {
    university: "",
    course: "",
    duration: ""
  },
  {
    university: "",
    course: "",
    duration: ""
  }
]
let long_description = `Cold Calling, Appointment Setting, Prospecting That Converts To New Sales Opportunities.

I've discovered my sales talent while I was working in MHG, selling consulting services to mid-size up to fortune 500 companies. I am proud to have references, proven track of been able to close deals turning into outstanding results.

I perfected my sales skills working for CTS highly involved in transitioning corporate America professionals into owning their own companies. This particular experience provided me with great sales education and vision. In the aforementioned company, in short periods of time, I reached the top 5% in sales professionals. My secret for achieving sales success is being different and persistent!

I'm a perfectionist and every job I take I must finish it with perfection. My goal is to reach the highest spot among Upwork professional freelancers, therefore I'm looking for an opportunity to prove my value.

My core skills are:
- Cold calling
- Business Development
- Prospecting
- Closing
- Following Up
- Appointment setting
- Excellent customer service
- Excellent Telephone skills`
const advocates = [
  {
    user_id: 'lj93nlfaeir3nasfdnaweifo',
    name: 'John Doe',
    picture: 'https://bscholarly.com/wp-content/uploads/2023/02/Top-10-Lawyers-in-the-World-300x225.jpg',
    role_title: 'Buisness Consultation',
    location: 'Delhi',
    pricing: 20000,
    total_Earnings: 500000,
    total_worked_hour: 200,
    short_description: 'Experienced advocate with expertise in corporate law',
    long_description,
    total_jobs: 20,
    fluent_language: ['English', 'Spanish'],
    conversational_language: ['French', 'Italian'],
    skills: ['Contract Law', 'Mergers & Acquisitions', 'Corporate Governance'],
    Education: [{
      university: "Harvard Law School",
      course: "M.A",
      duration: "2010 - 2013"
    },
    {
      university: "University of California, Berkeley",
      course: "B.A",
      duration: "2013 - 2016"
    }]
  },
  {
    user_id: 'lj93fasir3awesdsfdnaifo',
    name: 'Jane Smith',
    picture: 'https://bscholarly.com/wp-content/uploads/2023/02/Who-is-the-Best-lawyer-in-America-300x225.jpg',
    role_title: 'Property & Civil Matters',
    location: 'Jaipur',
    pricing: 15000,
    total_Earnings: 400000,
    total_worked_hour: 180,
    short_description: 'Passionate advocate with experience in civil rights law',
    long_description,
    total_jobs: 15,
    fluent_language: ['English', 'French'],
    conversational_language: ['Spanish', 'German'],
    skills: ['Civil Rights Litigation', 'Police Misconduct', 'Discrimination'],
    Education: [{
      university: "J.D Georgetown University Law Centerl",
      course: "M.A",
      duration: "2010 - 2013"
    },
    {
      university: "Howard University",
      course: "B.A",
      duration: "2013 - 2016"
    }]
  },
  {
    user_id: 'ilnefi39wefihslkdesf',
    name: 'Harish Salve',
    picture: 'https://www.edudwar.com/wp-content/uploads/2022/10/Harish-Salve.jpg.webp',
    role_title: 'Buisness Consultation',
    location: 'Bangalore',
    pricing: 300,
    total_Earnings: 8000,
    total_worked_hour: 200,
    short_description: 'Experienced advocate with expertise in corporate law',
    long_description,
    total_jobs: 25,
    fluent_language: ['English', 'Hindi'],
    conversational_language: ['French', 'Malyalam'],
    skills: ['Contract Law', 'Mergers & Acquisitions', 'Corporate Governance'],
    Education: [{
      university: "J.D Georgetown University Law Centerl",
      course: "M.A",
      duration: "2010 - 2013"
    },
    {
      university: "Howard University",
      course: "B.A",
      duration: "2013 - 2016"
    }]

  },
  {
    user_id: 'ljsiefnasefa4i8nfa',
    name: 'K. Parasaran',
    picture: 'https://www.edudwar.com/wp-content/uploads/2022/10/K.-Parasaran.jpg.webp',
    role_title: 'Property & Civil Matters',
    location: 'Jaipur',
    pricing: 100,
    total_Earnings: 7000,
    total_worked_hour: 380,
    short_description: 'Passionate advocate with experience in civil rights law',
    long_description,
    total_jobs: 15,
    fluent_language: ['English', 'French'],
    conversational_language: ['Telugu', 'German'],
    skills: ['Civil Rights Litigation', 'Police Misconduct', 'Discrimination'],
    Education: [{
      university: "J.D Georgetown University Law Centerl",
      course: "M.A",
      duration: "2010 - 2013"
    },
    {
      university: "Howard University",
      course: "B.A",
      duration: "2013 - 2016"
    }]
  }
];

advrouter.post('/post', (req, res) => {
  let body = advocates[3]
  // let body = { ...data, fluent_language: data.fluent_language.split(' '), conversational_language: data.conversational_language.split(' '), skills: data.skills.split(" ") }
  // const token = req.cookies?.token
  // console.log(body)
  const advocate = new AdvocateModel(body);
  advocate.save((err, doc) => {
    if (err) {
      console.error(err);
      res.status(500).status(500).send({ err: 'Error saving advocate' });
    } else {
      res.status(201).send({ "msg": "sucessfull saved your detail" });

      async function updateDocument() {
        try {
          const result = await UserModel.updateOne({ _id: body.user_id }, { stage: 2 });
          console.log(`Updated ${result.nModified} document(s)`);
        } catch (error) {
          console.error(error);
        }
      }

      updateDocument();
    }
  });
});

// Default Data Structures used repeatedly
var performanceDefaults = [
	{
		name: 'Mentorship',
		skills: 'Teach the acquired knowledge to current or new hires',
		tools: 'LinkedIn Learning, BAI, CUES',
	},
	{
		name: 'Culture Ambassador',
		skills: 'Engage in Visions Brand Ambassador Activities',
		tools: 'Community Impact Initiatives',
	},
	{
		name: 'Innovation',
		skills: 'Collaborate in process improvement',
		tools: 'Project Engagement',
	},
	{
		name: 'Continual Education',
		skills: 'Further Expertise',
		tools: 'LinkedIn Learning, CUES, Classroom Training',
	},
];

var potentialDefaults = [
	{
		name: 'Communication Skills',
		skills:
			'Active Listening, Two-way communication, Communication Styles, Writing, Public Speaking',
		tools: 'BAI, LinkedIn Learning, CUES, ToastMasters',
	},
	{
		name: 'Interpersonal/Emotional Intelligence',
		skills:
			'EI, Self Awareness, Self Regulation, Empathy, Social Skills, Motivation, Influence, Connection',
		tools: 'BAI, LinkedIn Learning, CUES',
	},
	{
		name: 'Willingness and Ability to Learn',
		skills:
			'*This category can not be developed if willingness is not demonstrated. Explore best way to optimize learning',
		tools: 'BAI, LinkedIn Learning, CUES',
	},
	{
		name: 'Initiave and Individual Drive',
		skills:
			'Problem Solving, Project Engagement, Team Improvement/Impact, Individual Continued Learning',
		tools: 'BAI, LinkedIn Learning, CUES',
	},
	{
		name: 'Adaptability',
		skills:
			'Become a Change Agent, Operating out of comfort zone, Overcome Barriers, Plan for the Unplanned',
		tools: 'BAI, LinkedIn Learning, CUES',
	},
	{
		name: 'Strategic/Critical Thinking',
		skills: 'Solution Driven, Mitigating Risk, Strategy Building',
		tools: 'LinkedIn Learning, BAI, CUES',
	},
];

var perfScoreCardDefaults = [
	{
		name: 'Scorecard',
		skills: 'Trusted Advisor, Member Engagement Activities',
		tools: 'Classroom, Mentor, BAI, CUES',
	},
	{
		name: 'NPS',
		skills: 'Engage in Visions Brand Ambassador Activities',
		tools: 'Mentor, LinkedIn Learning, CUES',
	},
	{
		name: 'Operational',
		skills:
			'Compliance, Cash Contro, Branch Operations, Membership Quality Control, Risk Control',
		tools: 'Classroom, Mentor, BAI, CUES',
	},
	{
		name: 'Exhibits Visions Mission/Values',
		skills:
			'Team Collaboration, Leadership, Partner Collaboration, Community Engagement',
		tools: 'LinkedIn Learning, CUES, Classroom',
	},
];

// Exported path maps for use in action js file
var pathMaps = {
	// Valued Specialist
	A4: {
		'In Role - Performance': [...performanceDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'Out of Branch',
				skills:
					'Same level of complexity support role that uses current technical knowledge as core',
				tools: 'Job Shadow, Lunch & Learn',
			},
		],
		Title: 'Valued Specialist',
		Definition: `Capable of assuming a new role at the same level of complexity.  Highly competent in current role. Role model in current function.`,
	},
	// Emerging Specialist
	B5: {
		'In Role - Performance': [...perfScoreCardDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'Out of Branch',
				skills:
					'Same or lower level of complexity support role that uses either current technical knowledge as core or education/prior experience in a different channel of the organization',
				tools: 'Job Shadow, Lunch & Learn',
			},
		],
		Title: 'Emerging Specialist',
		Definition: `Meets performance expectations.  Capable of assuming positions at the same level of complexity.  Competent in current role.  Steady performer within functional area or current level of responsibility.`,
	},
	// Under Performer
	C6: {
		'In Role - Performance': [...perfScoreCardDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'Out of Branch - Role Misplacement',
				skills:
					'Analyze prior and current experience/skills set/education for other open positions in organization and if no fit found exiting the organization might be appropriate',
				tools: 'Job Shadow, Lunch & Learn',
			},
		],
		Title: 'Under Performer',
		Definition: `Below performance expectations.  Lacks competence in current role.  If no improvement is displayed after development, exiting the organization may be appropriate.`,
	},
	// Emerging Potential
	A3: {
		'In Role - Performance': [...performanceDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'In Branch',
				skills:
					'Can grow to higher level of complexity within branch of CC if the right potential gears are nurtured',
				tools: 'Mentorship, Job Shadow, Higher than role skill learning',
			},
			{
				name: 'Out of Branch',
				skills:
					'Same level of complexity or higher support role that uses current high scoring performance categories',
				tools: 'Job Shadow, Internal Mentor not in Branch',
			},
		],
		Title: 'Emerging Potential',
		Definition: `Capable of growing into a more complex role within the same level.  This person could advance to the next layer.  Highly competent in current role.  Role model in their current position.`,
	},
	// Solid Contributor
	B4: {
		'In Role - Performance': [...perfScoreCardDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'In Branch',
				skills:
					'Could grow in a level up or parallel in larger branch or CC especially if potential on the higher end of spectrum',
				tools: 'Higher than role skill learning, Mentoring',
			},
			{
				name: 'Out of Branch',
				skills:
					'Same level of complexity support role. Could advance to a higher level out of branch role if prior experience or education match the channel',
				tools: 'Job Shadow, Internal Mentor not in Branch',
			},
		],
		Title: 'Solid Contributor',
		Definition: `Meets performance expectations.  Capable of growing into a more complex role within the same level.  This person could advance to the next layer.  Competent in current role.  Core of the business, consistent performance results`,
	},
	// Inconsistent Performer
	C5: {
		'In Role - Performance': [...perfScoreCardDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'Out of Branch',
				skills:
					'Lower level of complexity support role that uses some current technical knowledge as core',
				tools: 'Job Shadow',
			},
		],
		Title: 'Inconsistent Perfomer',
		Definition: `Below performance expectations.  Inconsistent or disappointing performance in relation to potential exhibited.  Lacks competence in current role.  May still be new to position but doesn't seem to be adapting as well as anticipated.  Improved performance is necessary before advancement expected.`,
	},
	// Top Talent
	A2: {
		'In Role - Performance': [...performanceDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'In Branch',
				skills:
					'Can progress to higher complexity role in branch or CC rapidly even with skip level or over qulified in current role',
				tools:
					'Skip Level Mentor, External Next Level Learning, Commitee Participation',
			},
			{
				name: 'Out of Branch',
				skills:
					'Same level or higher of complexity support role that uses current technical knowledge and individual potential to expand support role',
				tools:
					'Job Shadow, Department Rotation, Lunch & Learn, Internal Networking',
			},
		],
		Title: 'Top Talent',
		Definition: `Potential to grow into a role with much broader responsibility and complexity.  This person could advance into a role one layer above current position within 0-2 year time frame.  Highly competent in current role.  Role model in their current position.`,
	},
	// Rising Star
	B3: {
		'In Role - Performance': [...perfScoreCardDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'In Branch',
				skills:
					'Could advance one level above current in branch or CC if the right opportunity or performance levers are triggered',
				tools: 'Above role learning, Mentorship, Project Participation',
			},
			{
				name: 'Out of Branch',
				skills:
					'Same level of complexity or higher support role that uses current technical knowledge as core, Prior Experience or Potential Strength',
				tools: 'Job Shadow, Lunch & Learn, Internal Networking',
			},
		],
		Title: 'Rising Star',
		Definition: `Meets performance expectations.  Potential to grow into a role with much broader responsibilities.  This person could advance into a role at least one layer above their current position.  Competent in current role.  Core of the business, consistent performance results.`,
	},
	// New to Role
	C4: {
		'In Role - Performance': [...perfScoreCardDefaults],
		'In Role - Potential': [...potentialDefaults],
		'Out of Role': [
			{
				name: 'Out of Branch',
				skills:
					'*If more than 18 months in role consider role fit with current skill strengths',
				tools: 'Job Shadow, Lunch & Learn, Internal Networking',
			},
		],
		Title: 'New to Role',
		Definition: `Too early to assess performance and or competence.  Likely and individual who is adapting to a new role (not just new to company).  Perceived to be able to take on greater responsibilities / roles once performance is demonstrated.  Anticipate successful results once this person matures in their current role.`,
	},
};

function getPathMaps() {
	return pathMaps;
}

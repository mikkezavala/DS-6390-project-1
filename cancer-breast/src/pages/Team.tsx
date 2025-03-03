import {Avatar, Card, Col, Row} from "antd";

import mza from '/src/assets/mz.png'
import bb from '/src/assets/bb.png'
import ba from '/src/assets/ba.png'

export const Team = () => {
    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card variant="borderless">
                    <Card.Meta avatar={<Avatar src={mza}/>} title="Miguel Zavala"/>
                    <p>
                        I am a passionate software engineer. I've spent more than two decades writing code for
                        enterprises in a set of diverse industries. I started my career as a software engineer in travel
                        and leisure, which taught me interesting things about human traveling behaviors.
                        <br/>
                        In 2017, I decided to explore the ins and outs of software engineering in other industries more
                        and ended up in the Fintech world. I learned a lot about taxes and financial health, which
                        drives me to learn more about how to interpret human spending behaviors and help them be
                        financially healthy.
                    </p>
                </Card>
            </Col>
            <Col span={8}>
                <Card variant="borderless">
                    <Card.Meta avatar={<Avatar src={bb}/>} title="Brittany Blackmon"/>
                    <p>
                        Brittany Blackmon is a Dallas, TX resident working in global lifecycle marketing at Peloton,
                        where she specializes in building brand loyalty and engagement. Her role integrates her
                        marketing
                        expertise with her growing passion for data, AI, and machine learning. Brittany earned a
                        Bachelor of Arts and Humanities in Mass Communication with a concentration in Public Relations
                        from Southern
                        University and A&M College. She is currently pursuing a data science degree to further enhance
                        her strategic approach in both marketing and technology.
                        <br/>
                        Brittany's interests extend to venture capital, particularly angel investing, with aspirations
                        to
                        advise startups. She aims to leverage her background in data science and machine learning to
                        help
                        scale businesses that use AI or machine learning. Additionally, she is committed to addressing
                        racial and equity biases in data and AI software, working to ensure fairness and equal
                        functionality
                        in these systems.
                    </p>
                </Card>
            </Col>
            <Col span={8}>
                <Card variant="borderless">
                    <Card.Meta avatar={<Avatar src={ba}/>} title="Blake Armstrong"/>
                    <p>
                        Blake is an engineer with over seven years of experience in the oil and gas industry, currently
                        contributing to a Fort Worth-based private operator. Throughout my career, I have held various
                        roles, demonstrating a strong understanding of both technical and operational aspects of the
                        sector. Alongside my engineering career, I love to test my entrepreneurial spirit with real
                        estate investments.
                        <br/>
                        I graduated from Texas A&M University in 2017 with a BS in Petroleum Engineering and a Petroleum
                        Ventures Program certification. As part of the inaugural class of the Petroleum Ventures
                        Program, students received a unique education opportunity that blends petroleum engineering with
                        finance, providing them with a well-rounded foundation in both technical and financial
                        disciplines.
                        <br/>
                        In my free time, I enjoy spending time with my chocolate lab, Boudreaux. If I have some extra
                        free time I also enjoy hanging out with friends, playing golf, and ideally both at the same
                        time.
                    </p>
                </Card>
            </Col>
        </Row>
    )
}
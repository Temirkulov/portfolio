import React from "react";

function article_1() {
	return {
		date: "May 2023",
		title: "Article 1",
		description:
			"This is a sample text for Article 1. To be filled later.",
		style: `
				.article-content {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.randImage {
					align-self: center;
					outline: 2px solid red;
				}
				`,
		body: (
			<React.Fragment>
				<div className="article-content">
					<div className="paragraph">Content of article 1</div>
					{/* <img
						src="https://picsum.photos/200/300"
						alt="random"
						className="randImage"
					/> */}
				</div>
			</React.Fragment>
		),
	};
}

function article_2() {
	return {
		date: "June 2023",
		title: "Article 2",
		description:
			"This is sample text for Article 2, which I will write on later as I expand my knowledge and share my perspective.",
		style: ``,
		body: (
			<React.Fragment>
				<h1>Content of article 2</h1>
			</React.Fragment>
		),
	};
}

const myArticles = [article_1, article_2];

export default myArticles;

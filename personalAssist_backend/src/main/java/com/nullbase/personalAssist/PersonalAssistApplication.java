package com.nullbase.personalAssist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.nullbase.personalAssist.config.DotenvConfig;

@SpringBootApplication
public class PersonalAssistApplication {

	public static void main(String[] args) {

		SpringApplication app = new SpringApplication(PersonalAssistApplication.class);

		app.addInitializers(new DotenvConfig());

		app.run(args);
	}
}